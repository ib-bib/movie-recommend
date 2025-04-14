import { TRPCError } from "@trpc/server";
// import path from "path";
// import fs from "fs";
import { z } from "zod";
import { env } from "~/env";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import {
  movieRecommendations,
  users,
  userMovieInteractions,
} from "~/server/db/schema";
import { and, eq } from "drizzle-orm";

const FLASK_API =
  env.NODE_ENV == "production"
    ? "https://flask-movie-rec-api.onrender.com"
    : "http://localhost:5000";

type FlaskRecommendation = {
  rec_title: string;
  rec_id: number;
};

type FlaskHybridResponse = {
  movie: string;
  cf: FlaskRecommendation[];
  cbf: FlaskRecommendation[];
};

export const movieRouter = createTRPCRouter({
  // getAll: publicProcedure.query(async ({ ctx }) => {
  //   return await ctx.db.query.movies.findMany({
  //     orderBy: (movies, { desc }) => [desc(movies.bayesianRating)],
  //   });
  // }),

  // getMoviesToDisk: publicProcedure.query(async ({ ctx }) => {
  //   const allMovies = await ctx.db.query.movies.findMany({
  //     orderBy: (movies, { desc }) => [desc(movies.bayesianRating)],
  //   });

  //   // Resolve the path to write to
  //   const dirPath = path.resolve(process.cwd(), "src/lib");
  //   const filePath = path.join(dirPath, "staticMovies.ts");

  //   // Make sure the directory exists
  //   fs.mkdirSync(dirPath, { recursive: true });

  //   // Write the file
  //   fs.writeFileSync(
  //     filePath,
  //     `// This file is auto-generated. Do not edit manually.\n` +
  //       `export const staticMovies = ${JSON.stringify(allMovies, null, 2)};\n`,
  //   );

  //   console.log(`✅ Exported ${allMovies.length} movies to staticMovies.ts`);

  //   return allMovies;
  // }),

  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input, ctx }) => {
      return await ctx.db.query.movies.findFirst({
        where: (movies, { eq }) => eq(movies.movieId, input.id),
      });
    }),

  getLikedMovies: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.query.userMovieInteractions.findMany({
      where: (userMovieInteractions, { eq, and }) =>
        and(
          eq(userMovieInteractions.userId, ctx.session.user.id),
          eq(userMovieInteractions.liked, true),
        ),
      with: {
        movie: true,
      },
    });
  }),

  getDislikedMovies: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.query.userMovieInteractions.findMany({
      where: (userMovieInteractions, { eq, and }) =>
        and(
          eq(userMovieInteractions.userId, ctx.session.user.id),
          eq(userMovieInteractions.disliked, true),
        ),
      with: {
        movie: true,
      },
    });
  }),

  getSavedMovies: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.query.userMovieInteractions.findMany({
      where: (userMovieInteractions, { eq, and }) =>
        and(
          eq(userMovieInteractions.userId, ctx.session.user.id),
          eq(userMovieInteractions.saved, true),
        ),
      with: {
        movie: true,
      },
    });
  }),

  getMyRecommendations: protectedProcedure.query(async ({ ctx }) => {
    const interactions = await ctx.db.query.userMovieInteractions.findMany({
      where: (userMovieInteractions, { eq }) =>
        eq(userMovieInteractions.userId, ctx.session.user.id),
      columns: { movieId: true },
    });

    const interactedMovieIds = interactions.map((i) => i.movieId);

    return await ctx.db.query.movieRecommendations.findMany({
      where: (movieRecommendations, { eq, and, notInArray }) =>
        and(
          eq(movieRecommendations.userId, ctx.session.user.id),
          eq(movieRecommendations.disliked, false),
          eq(movieRecommendations.liked, false),
          eq(movieRecommendations.saved, false),
          notInArray(
            movieRecommendations.movieId,
            interactedMovieIds.length > 0 ? interactedMovieIds : [-1],
          ), // avoids SQL syntax issues
        ),
      with: {
        movie: true,
      },
    });
  }),

  getLikedRecommendations: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.query.movieRecommendations.findMany({
      where: (movieRecommendations, { eq, and }) =>
        and(
          eq(movieRecommendations.userId, ctx.session.user.id),
          eq(movieRecommendations.liked, true),
        ),
      with: {
        movie: true,
      },
    });
  }),

  getDislikedRecommendations: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.query.movieRecommendations.findMany({
      where: (movieRecommendations, { eq, and }) =>
        and(
          eq(movieRecommendations.userId, ctx.session.user.id),
          eq(movieRecommendations.disliked, true),
        ),
      with: {
        movie: true,
      },
    });
  }),

  getSavedRecommendations: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.query.movieRecommendations.findMany({
      where: (movieRecommendations, { eq, and }) =>
        and(
          eq(movieRecommendations.userId, ctx.session.user.id),
          eq(movieRecommendations.saved, true),
        ),
      with: {
        movie: true,
      },
    });
  }),

  likeMovie: protectedProcedure
    .input(z.object({ id: z.number(), title: z.string(), year: z.number() }))
    .mutation(async ({ input, ctx }) => {
      const userId = ctx.session.user.id;
      const movieId = input.id;

      const existingInteraction =
        await ctx.db.query.userMovieInteractions.findFirst({
          where: (t, { eq, and }) =>
            and(eq(t.userId, userId), eq(t.movieId, movieId)),
        });

      // unliking
      if (existingInteraction?.liked) {
        await ctx.db
          .update(userMovieInteractions)
          .set({ liked: false })
          .where(
            and(
              eq(userMovieInteractions.userId, userId),
              eq(userMovieInteractions.movieId, movieId),
            ),
          );
        return;
      }

      // changing from dislike or save to like
      await ctx.db
        .insert(userMovieInteractions)
        .values({
          userId,
          movieId,
          liked: true,
        })
        .onConflictDoUpdate({
          target: [userMovieInteractions.userId, userMovieInteractions.movieId],
          set: { liked: true, disliked: false, saved: false },
        });

      const activeUser = await ctx.db.query.users.findFirst({
        where: (users, { eq }) => eq(users.id, userId),
      });

      if (!activeUser?.cf_weight) {
        throw new TRPCError({
          message: "Missing cf_weight for user",
          code: "INTERNAL_SERVER_ERROR",
        });
      }
      const cf_weight = activeUser.cf_weight;

      console.log("Generating recommendations...");
      const res = await fetch(
        `${FLASK_API}/recommend/${encodeURIComponent(input.title + " " + input.year)}/${cf_weight}`,
      );
      const data = (await res.json()) as FlaskHybridResponse;
      const cf_recs = data.cf;
      const cbf_recs = data.cbf;
      console.log("Recommendations generated");

      await ctx.db
        .insert(movieRecommendations)
        .values(
          cf_recs.map((rec: { rec_id: number }) => ({
            userId,
            movieId: rec.rec_id,
            model: "cf",
            fromMovie: input.title,
            fromLike: true,
          })),
        )
        .onConflictDoNothing();

      await ctx.db
        .insert(movieRecommendations)
        .values(
          cbf_recs.map((rec: { rec_id: number }) => ({
            userId,
            movieId: rec.rec_id,
            model: "cbf",
            fromMovie: input.title,
            fromLike: true,
          })),
        )
        .onConflictDoNothing();
    }),

  dislikeMovie: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input, ctx }) => {
      const userId = ctx.session.user.id;
      const movieId = input.id;

      const existingInteraction =
        await ctx.db.query.userMovieInteractions.findFirst({
          where: (t, { eq, and }) =>
            and(eq(t.userId, userId), eq(t.movieId, movieId)),
        });

      // un-disliking
      if (existingInteraction?.disliked) {
        await ctx.db
          .update(userMovieInteractions)
          .set({ disliked: false })
          .where(
            and(
              eq(userMovieInteractions.userId, userId),
              eq(userMovieInteractions.movieId, movieId),
            ),
          );
        return;
      }

      await ctx.db
        .insert(userMovieInteractions)
        .values({
          userId,
          movieId,
          disliked: true,
        })
        .onConflictDoUpdate({
          target: [userMovieInteractions.userId, userMovieInteractions.movieId],
          set: { liked: false, disliked: true, saved: false },
        });
    }),

  saveMovie: protectedProcedure
    .input(z.object({ id: z.number(), title: z.string(), year: z.number() }))
    .mutation(async ({ input, ctx }) => {
      const userId = ctx.session.user.id;
      const movieId = input.id;

      const existingInteraction =
        await ctx.db.query.userMovieInteractions.findFirst({
          where: (t, { eq, and }) =>
            and(eq(t.userId, userId), eq(t.movieId, movieId)),
        });

      // unsaving
      if (existingInteraction?.liked) {
        await ctx.db
          .update(userMovieInteractions)
          .set({ saved: false })
          .where(
            and(
              eq(userMovieInteractions.userId, userId),
              eq(userMovieInteractions.movieId, movieId),
            ),
          );
        return;
      }

      await ctx.db
        .insert(userMovieInteractions)
        .values({
          userId,
          movieId,
          saved: true,
        })
        .onConflictDoUpdate({
          target: [userMovieInteractions.userId, userMovieInteractions.movieId],
          set: { liked: false, disliked: false, saved: true },
        });

      const activeUser = await ctx.db.query.users.findFirst({
        where: (users, { eq }) => eq(users.id, ctx.session.user.id),
      });

      if (!activeUser?.cf_weight) {
        throw new TRPCError({
          message: "Missing cf_weight for user",
          code: "INTERNAL_SERVER_ERROR",
        });
      }
      const cf_weight = activeUser.cf_weight;

      const res = await fetch(
        `${FLASK_API}/recommend/${encodeURIComponent(input.title + " " + input.year)}/${cf_weight}`,
      );
      const data = (await res.json()) as FlaskHybridResponse;
      const cf_recs = data.cf;
      const cbf_recs = data.cbf;

      await ctx.db
        .insert(movieRecommendations)
        .values(
          cf_recs.map((rec: { rec_id: number }) => ({
            userId: ctx.session.user.id,
            movieId: rec.rec_id,
            model: "cf",
            fromMovie: input.title,
            fromLike: false,
          })),
        )
        .onConflictDoNothing();

      await ctx.db
        .insert(movieRecommendations)
        .values(
          cbf_recs.map((rec: { rec_id: number }) => ({
            userId: ctx.session.user.id,
            movieId: rec.rec_id,
            model: "cbf",
            fromMovie: input.title,
            fromLike: false,
          })),
        )
        .onConflictDoNothing();
    }),

  likeRec: protectedProcedure
    .input(
      z.object({
        recId: z.number(),
        recTitle: z.string(),
        model: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const other_model_rec = await ctx.db.query.movieRecommendations.findFirst(
        {
          where: (movieRecommendations, { eq, and }) =>
            and(
              eq(
                movieRecommendations.model,
                input.model == "cf" ? "cbf" : "cf",
              ),
              eq(movieRecommendations.userId, ctx.session.user.id),
              eq(movieRecommendations.movieId, input.recId),
            ),
        },
      );

      const activeUser = await ctx.db.query.users.findFirst({
        where: (users, { eq }) => eq(users.id, ctx.session.user.id),
      });

      if (!activeUser?.cf_weight) {
        throw new TRPCError({
          message: "Missing cf_weight for user",
          code: "INTERNAL_SERVER_ERROR",
        });
      }
      const cf_weight = activeUser.cf_weight;

      const res = await fetch(
        `${FLASK_API}/recommend/${encodeURIComponent(input.recTitle)}/${cf_weight}`,
      );
      const data = (await res.json()) as FlaskHybridResponse;
      const cf_recs = data.cf;
      const cbf_recs = data.cbf;

      let new_cf_weight = 0;
      if (cf_weight > 2 && cf_weight < 10) {
        if (!other_model_rec) {
          new_cf_weight =
            input.model == "cf" ? cf_weight + 0.2 : cf_weight - 0.2;
          await ctx.db
            .update(users)
            .set({
              cf_weight: new_cf_weight,
            })
            .where(eq(users.id, ctx.session.user.id));
        }
      }

      await ctx.db
        .update(movieRecommendations)
        .set({
          liked: true,
        })
        .where(eq(movieRecommendations.id, input.recId));

      await ctx.db
        .insert(movieRecommendations)
        .values(
          cf_recs.map((rec: { rec_id: number }) => ({
            userId: ctx.session.user.id,
            movieId: rec.rec_id,
            model: "cf",
          })),
        )
        .onConflictDoNothing();

      await ctx.db
        .insert(movieRecommendations)
        .values(
          cbf_recs.map((rec: { rec_id: number }) => ({
            userId: ctx.session.user.id,
            movieId: rec.rec_id,
            model: "cbf",
          })),
        )
        .onConflictDoNothing();
    }),

  saveRec: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
        recId: z.number(),
        recTitle: z.string(),
        model: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const other_model_rec = await ctx.db.query.movieRecommendations.findFirst(
        {
          where: (movieRecommendations, { eq, and }) =>
            and(
              eq(
                movieRecommendations.model,
                input.model == "cf" ? "cbf" : "cf",
              ),
              eq(movieRecommendations.userId, ctx.session.user.id),
              eq(movieRecommendations.movieId, input.recId),
            ),
        },
      );

      await ctx.db
        .update(movieRecommendations)
        .set({
          saved: true,
        })
        .where(eq(movieRecommendations.id, input.recId));

      const activeUser = await ctx.db.query.users.findFirst({
        where: (users, { eq }) => eq(users.id, ctx.session.user.id),
      });

      if (!activeUser?.cf_weight) {
        throw new TRPCError({
          message: "Missing cf_weight for user",
          code: "INTERNAL_SERVER_ERROR",
        });
      }

      const cf_weight = activeUser.cf_weight;
      let new_weight = 0;

      if (cf_weight > 2 && cf_weight < 10) {
        if (input.model == "cf") {
          new_weight = cf_weight + 0.2;
        } else {
          new_weight = cf_weight - 0.2;
        }
      }

      if (new_weight != 0) {
        await ctx.db
          .update(users)
          .set({ cf_weight: users.cf_weight })
          .where(eq(users.id, input.userId));
      }

      const res = await fetch(
        `${FLASK_API}/recommend/${encodeURIComponent(input.recTitle)}/${cf_weight}`,
      );
      const data = (await res.json()) as FlaskHybridResponse;
      const cf_recs = data.cf;
      const cbf_recs = data.cbf;

      await ctx.db
        .insert(movieRecommendations)
        .values(
          cf_recs.map((rec: { rec_id: number }) => ({
            userId: ctx.session.user.id,
            movieId: rec.rec_id,
            model: "cf",
          })),
        )
        .onConflictDoNothing();

      await ctx.db
        .insert(movieRecommendations)
        .values(
          cbf_recs.map((rec: { rec_id: number }) => ({
            userId: ctx.session.user.id,
            movieId: rec.rec_id,
            model: "cbf",
          })),
        )
        .onConflictDoNothing();
    }),

  dislikeRec: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
        recId: z.number(),
        model: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      await ctx.db
        .update(movieRecommendations)
        .set({
          disliked: true,
        })
        .where(eq(movieRecommendations.movieId, input.recId));

      const activeUser = await ctx.db.query.users.findFirst({
        where: (users, { eq }) => eq(users.id, ctx.session.user.id),
      });

      if (!activeUser?.cf_weight) {
        throw new TRPCError({
          message: "Missing cf_weight for user",
          code: "INTERNAL_SERVER_ERROR",
        });
      }

      const cf_weight = activeUser.cf_weight;
      let new_weight = 0;

      if (cf_weight > 2 && cf_weight < 10) {
        if (input.model == "cf") {
          new_weight = cf_weight + 0.2;
        } else {
          new_weight = cf_weight - 0.2;
        }
      }

      if (new_weight != 0) {
        await ctx.db
          .update(users)
          .set({ cf_weight: users.cf_weight })
          .where(eq(users.id, input.userId));
      }
    }),
});
