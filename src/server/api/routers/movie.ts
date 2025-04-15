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
        where: (t, { eq }) => eq(t.movieId, input.id),
      });
    }),

  isLiked: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      const likedFromInteraction =
        await ctx.db.query.userMovieInteractions.findFirst({
          where: (t, { eq, and }) =>
            and(
              eq(t.userId, userId),
              eq(t.movieId, input.id),
              eq(t.liked, true),
            ),
        });

      const likedFromRecommendation =
        await ctx.db.query.movieRecommendations.findFirst({
          where: (t, { eq, and }) =>
            and(
              eq(t.userId, userId),
              eq(t.movieId, input.id),
              eq(t.liked, true),
            ),
        });

      return likedFromInteraction || likedFromRecommendation ? true : false;
    }),

  isSaved: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      const savedFromInteraction =
        await ctx.db.query.userMovieInteractions.findFirst({
          where: (t, { eq, and }) =>
            and(
              eq(t.userId, userId),
              eq(t.movieId, input.id),
              eq(t.saved, true),
            ),
        });

      const savedFromRecommendation =
        await ctx.db.query.movieRecommendations.findFirst({
          where: (t, { eq, and }) =>
            and(
              eq(t.userId, userId),
              eq(t.movieId, input.id),
              eq(t.saved, true),
            ),
        });

      return savedFromInteraction || savedFromRecommendation ? true : false;
    }),

  isDisliked: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      const dislikedFromInteraction =
        await ctx.db.query.userMovieInteractions.findFirst({
          where: (t, { eq, and }) =>
            and(
              eq(t.userId, userId),
              eq(t.movieId, input.id),
              eq(t.disliked, true),
            ),
        });

      const dislikedFromRecommendation =
        await ctx.db.query.movieRecommendations.findFirst({
          where: (t, { eq, and }) =>
            and(
              eq(t.userId, userId),
              eq(t.movieId, input.id),
              eq(t.disliked, true),
            ),
        });

      return dislikedFromInteraction || dislikedFromRecommendation
        ? true
        : false;
    }),

  getLikedMovies: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.query.userMovieInteractions.findMany({
      where: (t, { eq, and }) =>
        and(eq(t.userId, ctx.session.user.id), eq(t.liked, true)),
      with: {
        movie: true,
      },
    });
  }),

  getDislikedMovies: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.query.userMovieInteractions.findMany({
      where: (t, { eq, and }) =>
        and(eq(t.userId, ctx.session.user.id), eq(t.disliked, true)),
      with: {
        movie: true,
      },
    });
  }),

  getSavedMovies: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.query.userMovieInteractions.findMany({
      where: (t, { eq, and }) =>
        and(eq(t.userId, ctx.session.user.id), eq(t.saved, true)),
      with: {
        movie: true,
      },
    });
  }),

  getMyRecommendations: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;

    const interactions = await ctx.db.query.userMovieInteractions.findMany({
      where: (t, { eq }) => eq(t.userId, userId),
      columns: { movieId: true },
    });

    const interactedMovieIds = interactions.map((i) => i.movieId);

    return await ctx.db.query.movieRecommendations.findMany({
      where: (t, { eq, and, notInArray }) =>
        and(
          eq(t.userId, userId),
          eq(t.disliked, false),
          eq(t.liked, false),
          eq(t.saved, false),
          notInArray(
            t.movieId,
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
      where: (t, { eq, and }) =>
        and(eq(t.userId, ctx.session.user.id), eq(t.liked, true)),
      with: {
        movie: true,
      },
    });
  }),

  getDislikedRecommendations: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.query.movieRecommendations.findMany({
      where: (t, { eq, and }) =>
        and(eq(t.userId, ctx.session.user.id), eq(t.disliked, true)),
      with: {
        movie: true,
      },
    });
  }),

  getSavedRecommendations: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.query.movieRecommendations.findMany({
      where: (t, { eq, and }) =>
        and(eq(t.userId, ctx.session.user.id), eq(t.saved, true)),
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

      // has a recommendation already been generated for this movie?
      const recommendationsExistForMovie =
        await ctx.db.query.movieRecommendations.findFirst({
          where: (t, { eq, and }) =>
            and(eq(t.userId, userId), eq(t.fromMovie, input.title)),
        });

      // reliking after unlike
      if (recommendationsExistForMovie) {
        await ctx.db
          .update(userMovieInteractions)
          .set({ liked: true })
          .where(
            and(
              eq(userMovieInteractions.userId, userId),
              eq(userMovieInteractions.movieId, movieId),
            ),
          );
        return;
      }

      // first time like
      await ctx.db.insert(userMovieInteractions).values({
        userId,
        movieId,
        liked: true,
      });

      const activeUser = await ctx.db.query.users.findFirst({
        where: (t, { eq }) => eq(t.id, userId),
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

  unlikeMovie: protectedProcedure
    .input(z.object({ movieId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .update(userMovieInteractions)
        .set({
          liked: false,
        })
        .where(
          and(
            eq(userMovieInteractions.userId, ctx.session.user.id),
            eq(userMovieInteractions.movieId, input.movieId),
          ),
        );
    }),

  dislikeMovie: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input, ctx }) => {
      const userId = ctx.session.user.id;
      const movieId = input.id;

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

  undislikeMovie: protectedProcedure
    .input(z.object({ movieId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .update(userMovieInteractions)
        .set({
          disliked: false,
        })
        .where(
          and(
            eq(userMovieInteractions.userId, ctx.session.user.id),
            eq(userMovieInteractions.movieId, input.movieId),
          ),
        );
    }),

  saveMovie: protectedProcedure
    .input(z.object({ id: z.number(), title: z.string(), year: z.number() }))
    .mutation(async ({ input, ctx }) => {
      const userId = ctx.session.user.id;
      const movieId = input.id;

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

  unsaveMovie: protectedProcedure
    .input(z.object({ movieId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .update(userMovieInteractions)
        .set({
          saved: false,
        })
        .where(
          and(
            eq(userMovieInteractions.userId, ctx.session.user.id),
            eq(userMovieInteractions.movieId, input.movieId),
          ),
        );
    }),

  likeRec: protectedProcedure
    .input(
      z.object({
        recId: z.number(),
        movieId: z.number(),
        recTitle: z.string(),
        model: z.string(),
        fromMovie: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const userId = ctx.session.user.id;

      const other_model_rec = await ctx.db.query.movieRecommendations.findFirst(
        {
          where: (t, { eq, and }) =>
            and(
              eq(t.model, input.model == "cf" ? "cbf" : "cf"),
              eq(t.userId, ctx.session.user.id),
              eq(t.movieId, input.movieId),
            ),
        },
      );

      if (!other_model_rec) {
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
            .where(eq(users.id, userId));
        }

        const res = await fetch(
          `${FLASK_API}/recommend/${encodeURIComponent(input.recTitle)}/${new_weight}`,
        );
        const data = (await res.json()) as FlaskHybridResponse;
        const cf_recs = data.cf;
        const cbf_recs = data.cbf;

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
      }
    }),

  saveRec: protectedProcedure
    .input(
      z.object({
        recId: z.number(),
        recTitle: z.string(),
        model: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const userId = ctx.session.user.id;

      const other_model_rec = await ctx.db.query.movieRecommendations.findFirst(
        {
          where: (t, { eq, and }) =>
            and(
              eq(t.model, input.model == "cf" ? "cbf" : "cf"),
              eq(t.userId, userId),
              eq(t.movieId, input.recId),
            ),
        },
      );

      if (!other_model_rec) {
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
            .where(eq(users.id, userId));
        }

        const res = await fetch(
          `${FLASK_API}/recommend/${encodeURIComponent(input.recTitle)}/${new_weight}`,
        );
        const data = (await res.json()) as FlaskHybridResponse;
        const cf_recs = data.cf;
        const cbf_recs = data.cbf;

        await ctx.db
          .insert(movieRecommendations)
          .values(
            cf_recs.map((rec: { rec_id: number }) => ({
              userId,
              movieId: rec.rec_id,
              model: "cf",
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
            })),
          )
          .onConflictDoNothing();
      }

      await ctx.db
        .update(movieRecommendations)
        .set({
          saved: true,
        })
        .where(eq(movieRecommendations.id, input.recId));
    }),

  dislikeRec: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
        recId: z.number(),
        movieId: z.number(),
        model: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const userId = ctx.session.user.id;

      const other_model_rec = await ctx.db.query.movieRecommendations.findFirst(
        {
          where: (t, { eq, and }) =>
            and(
              eq(t.userId, userId),
              eq(t.id, input.movieId),
              eq(t.model, input.model == "cf" ? "cbf" : "cf"),
            ),
        },
      );

      if (!other_model_rec) {
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
        let new_weight = 0;

        if (cf_weight > 2 && cf_weight < 10) {
          if (input.model == "cf") {
            new_weight = cf_weight - 0.2;
          } else {
            new_weight = cf_weight + 0.2;
          }
        }

        if (new_weight != 0) {
          await ctx.db
            .update(users)
            .set({ cf_weight: new_weight })
            .where(eq(users.id, input.userId));
        }
      }

      await ctx.db
        .update(movieRecommendations)
        .set({
          disliked: true,
        })
        .where(eq(movieRecommendations.movieId, input.recId));
    }),
});
