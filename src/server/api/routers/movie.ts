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
import { and, eq, count, notInArray, inArray, sql } from "drizzle-orm";

const FLASK_API =
  env.NODE_ENV == "production"
    ? "https://flask-movie-rec-api.onrender.com"
    : "http://localhost:5000";

type FlaskRecommendation = {
  rec_title: string;
  rec_movie_id: number;
};

type FlaskHybridResponse = {
  cf: FlaskRecommendation[];
  cbf: FlaskRecommendation[];
  movie_title: string;
};

export const movieRouter = createTRPCRouter({
  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input, ctx }) => {
      return await ctx.db.query.movies.findFirst({
        where: (t, { eq }) => eq(t.movieId, input.id),
      });
    }),

  getMovieGenres: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input, ctx }) => {
      const res = await ctx.db.query.movie_genres.findMany({
        where: (t, { eq }) => eq(t.movieId, input.id),
        with: {
          genre: true,
        },
      });

      const genres = res.map((obj) => obj.genre);

      return genres;
    }),

  isLiked: protectedProcedure
    .input(z.object({ movieId: z.number() }))
    .query(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      const interaction = await ctx.db.query.userMovieInteractions.findFirst({
        where: (t, { eq, and }) =>
          and(eq(t.userId, userId), eq(t.movieId, input.movieId)),
        columns: { liked: true },
      });

      if (interaction?.liked == null) {
        return false;
      }

      return interaction.liked;
    }),

  isSaved: protectedProcedure
    .input(z.object({ movieId: z.number() }))
    .query(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      const interaction = await ctx.db.query.userMovieInteractions.findFirst({
        where: (t, { eq, and }) =>
          and(eq(t.userId, userId), eq(t.movieId, input.movieId)),
        columns: { saved: true },
      });

      if (interaction?.saved == null) {
        return false;
      }

      return interaction.saved;
    }),

  isDisliked: protectedProcedure
    .input(z.object({ movieId: z.number() }))
    .query(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      const interaction = await ctx.db.query.userMovieInteractions.findFirst({
        where: (t, { eq, and }) =>
          and(
            eq(t.userId, userId),
            eq(t.movieId, input.movieId),
            eq(t.disliked, true),
          ),
      });

      if (interaction?.disliked == null) {
        return false;
      }

      return interaction.disliked;
    }),

  getLikedMovies: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;
    return await ctx.db.query.userMovieInteractions.findMany({
      where: (t, { eq, and }) => and(eq(t.userId, userId), eq(t.liked, true)),
      orderBy: (t, { desc }) => desc(t.interactedAt),
      columns: { movieId: true },
    });
  }),

  getMostRecent4LikedMovies: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;
    return await ctx.db.query.userMovieInteractions.findMany({
      where: (t, { eq, and }) => and(eq(t.userId, userId), eq(t.liked, true)),
      orderBy: (t, { desc }) => desc(t.interactedAt),
      limit: 4,
      columns: { movieId: true },
    });
  }),

  getDislikedMovies: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;
    return await ctx.db.query.userMovieInteractions.findMany({
      where: (t, { eq, and }) =>
        and(eq(t.userId, userId), eq(t.disliked, true)),
      orderBy: (t, { desc }) => desc(t.interactedAt),
      columns: { movieId: true },
    });
  }),

  getMostRecent4DislikedMovies: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;
    return await ctx.db.query.userMovieInteractions.findMany({
      where: (t, { eq, and }) =>
        and(eq(t.userId, userId), eq(t.disliked, true)),
      orderBy: (t, { desc }) => desc(t.interactedAt),
      limit: 4,
      columns: { movieId: true },
    });
  }),

  getSavedMovies: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;
    return await ctx.db.query.userMovieInteractions.findMany({
      where: (t, { eq, and }) => and(eq(t.userId, userId), eq(t.saved, true)),
      orderBy: (t, { desc }) => desc(t.interactedAt),
      columns: { movieId: true, interactedAt: true },
    });
  }),

  getMostRecent4SavedMovies: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;
    return await ctx.db.query.userMovieInteractions.findMany({
      where: (t, { eq, and }) => and(eq(t.userId, userId), eq(t.saved, true)),
      orderBy: (t, { desc }) => desc(t.interactedAt),
      limit: 4,
      columns: { movieId: true, interactedAt: true },
    });
  }),

  getMyRecommendations: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;

    const interactions = await ctx.db.query.userMovieInteractions.findMany({
      where: (t, { eq }) => eq(t.userId, userId),
      columns: { movieId: true, disliked: true },
    });

    const interactedMovieIds = interactions.map((i) => i.movieId);
    const dislikedMovieIds = interactions
      .filter((i) => i.disliked)
      .map((i) => i.movieId);

    // Get fromMovie titles to exclude by calling Flask API
    const dislikedTitles: string[] = [];
    for (const movieId of dislikedMovieIds) {
      const req = await fetch(`${FLASK_API}/get_title/${movieId}`);
      const data = (await req.json()) as { movie_title: string };
      dislikedTitles.push(data.movie_title);
    }

    const allRecs = await ctx.db.query.movieRecommendations.findMany({
      where: (t, { eq, and, notInArray }) =>
        and(
          eq(t.userId, userId),
          eq(t.disliked, false),
          eq(t.liked, false),
          eq(t.saved, false),
          notInArray(
            t.movieId,
            interactedMovieIds.length > 0 ? interactedMovieIds : [-1],
          ),
          // Exclude recs from disliked titles
          notInArray(
            t.fromMovie,
            dislikedTitles.length > 0 ? dislikedTitles : [""],
          ),
        ),
      orderBy: (t, { desc }) => desc(t.recommendedAt),
      columns: {
        movieId: true,
        id: true,
        model: true,
        fromLike: true,
        fromMovie: true,
      },
    });

    const seen = new Set<number>();
    const unique = [];

    for (const rec of allRecs) {
      if (!seen.has(rec.movieId)) {
        seen.add(rec.movieId);
        unique.push(rec);
      }
    }

    return unique;
  }),

  getMyMostRecent4Recommendations: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;

    const interactions = await ctx.db.query.userMovieInteractions.findMany({
      where: (t, { eq }) => eq(t.userId, userId),
      columns: { movieId: true, disliked: true },
    });

    const interactedMovieIds = interactions.map((i) => i.movieId);
    const dislikedMovieIds = interactions
      .filter((i) => i.disliked)
      .map((i) => i.movieId);

    // Get fromMovie titles to exclude by calling Flask API
    const dislikedTitles: string[] = [];
    for (const movieId of dislikedMovieIds) {
      const req = await fetch(`${FLASK_API}/get_title/${movieId}`);
      const data = (await req.json()) as { movie_title: string };
      dislikedTitles.push(data.movie_title);
    }

    const rawRecs = await ctx.db.query.movieRecommendations.findMany({
      where: (t, { eq, and, notInArray }) =>
        and(
          eq(t.userId, userId),
          eq(t.disliked, false),
          eq(t.liked, false),
          eq(t.saved, false),
          notInArray(
            t.movieId,
            interactedMovieIds.length > 0 ? interactedMovieIds : [-1],
          ),
          notInArray(
            t.fromMovie,
            dislikedTitles.length > 0 ? dislikedTitles : [""],
          ),
        ),
      orderBy: (t, { desc }) => desc(t.recommendedAt),
      columns: { movieId: true },
    });

    const seen = new Set<number>();
    const unique: { movieId: number }[] = [];

    for (const rec of rawRecs) {
      const movieId = Number(rec.movieId);
      if (!seen.has(movieId)) {
        seen.add(movieId);
        unique.push({ movieId });
      }
      if (unique.length === 4) break;
    }

    return unique;
  }),

  likeMovie: protectedProcedure
    .input(z.object({ movieId: z.number(), title: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const { movieId } = input;

      const alreadyInteractedBefore =
        await ctx.db.query.userMovieInteractions.findFirst({
          where: (t, { eq, and }) =>
            and(eq(t.userId, userId), eq(t.movieId, movieId)),
        });

      if (alreadyInteractedBefore == undefined) {
        // first time like
        const cf_weight = (
          await ctx.db.query.users.findFirst({
            where: (t, { eq }) => eq(t.id, userId),
            columns: { cf_weight: true },
          })
        )?.cf_weight;

        if (cf_weight == null || cf_weight == undefined) {
          throw new TRPCError({
            message: "Missing cf_weight for user",
            code: "INTERNAL_SERVER_ERROR",
          });
        }

        const res = await fetch(
          `${FLASK_API}/recommend/${movieId}/${cf_weight}`,
        );
        const data = (await res.json()) as FlaskHybridResponse;
        const { movie_title, cf, cbf } = data;

        await ctx.db
          .insert(movieRecommendations)
          .values(
            cf.map((rec) => ({
              userId,
              movieId: rec.rec_movie_id,
              model: "cf",
              fromMovie: movie_title,
              fromLike: true,
            })),
          )
          .onConflictDoNothing();

        await ctx.db
          .insert(movieRecommendations)
          .values(
            cbf.map((rec) => ({
              userId,
              movieId: rec.rec_movie_id,
              model: "cbf",
              fromMovie: movie_title,
              fromLike: true,
            })),
          )
          .onConflictDoNothing();

        await ctx.db.insert(userMovieInteractions).values({
          userId,
          movieId,
          liked: true,
        });
      } else {
        // re-liking or un-liking
        await ctx.db
          .update(userMovieInteractions)
          .set({
            liked: !alreadyInteractedBefore.liked,
          })
          .where(
            and(
              eq(userMovieInteractions.userId, userId),
              eq(userMovieInteractions.movieId, movieId),
            ),
          );
      }
      return {
        success: true,
      };
    }),

  unLikeMovie: protectedProcedure
    .input(z.object({ movieId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .update(userMovieInteractions)
        .set({ liked: false })
        .where(
          and(
            eq(userMovieInteractions.userId, ctx.session.user.id),
            eq(userMovieInteractions.movieId, input.movieId),
          ),
        );

      return {
        success: true,
      };
    }),

  unDislikeMovie: protectedProcedure
    .input(z.object({ movieId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .update(userMovieInteractions)
        .set({ disliked: false })
        .where(
          and(
            eq(userMovieInteractions.userId, ctx.session.user.id),
            eq(userMovieInteractions.movieId, input.movieId),
          ),
        );

      return {
        success: true,
      };
    }),

  saveMovie: protectedProcedure
    .input(z.object({ movieId: z.number(), title: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const { movieId } = input;

      const alreadyInteractedBefore =
        await ctx.db.query.userMovieInteractions.findFirst({
          where: (t, { eq, and }) =>
            and(eq(t.userId, userId), eq(t.movieId, movieId)),
        });

      if (alreadyInteractedBefore == undefined) {
        // first time save
        const cf_weight = (
          await ctx.db.query.users.findFirst({
            where: (t, { eq }) => eq(t.id, userId),
            columns: { cf_weight: true },
          })
        )?.cf_weight;

        if (cf_weight == undefined || cf_weight == null) {
          throw new TRPCError({
            message: "Missing cf_weight for user",
            code: "INTERNAL_SERVER_ERROR",
          });
        }

        const res = await fetch(
          `${FLASK_API}/recommend/${movieId}/${cf_weight}`,
        );
        const data = (await res.json()) as FlaskHybridResponse;
        const { movie_title, cf, cbf } = data;

        await ctx.db
          .insert(movieRecommendations)
          .values(
            cf.map((rec) => ({
              userId,
              movieId: rec.rec_movie_id,
              model: "cf",
              fromMovie: movie_title,
              fromLike: false,
            })),
          )
          .onConflictDoNothing();

        await ctx.db
          .insert(movieRecommendations)
          .values(
            cbf.map((rec) => ({
              userId,
              movieId: rec.rec_movie_id,
              model: "cbf",
              fromMovie: movie_title,
              fromLike: false,
            })),
          )
          .onConflictDoNothing();

        await ctx.db.insert(userMovieInteractions).values({
          userId,
          movieId,
          saved: true,
        });
      } else {
        // re-saving or un-saving
        return await ctx.db
          .update(userMovieInteractions)
          .set({
            saved: !alreadyInteractedBefore.saved,
          })
          .where(
            and(
              eq(userMovieInteractions.userId, userId),
              eq(userMovieInteractions.movieId, movieId),
            ),
          );
      }
      return {
        success: true,
      };
    }),

  unSaveMovie: protectedProcedure
    .input(z.object({ movieId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .update(userMovieInteractions)
        .set({ saved: false })
        .where(
          and(
            eq(userMovieInteractions.userId, ctx.session.user.id),
            eq(userMovieInteractions.movieId, input.movieId),
          ),
        );

      return {
        success: true,
      };
    }),

  dislikeMovie: protectedProcedure
    .input(z.object({ movieId: z.number(), title: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const userId = ctx.session.user.id;
      const movieId = input.movieId;

      const alreadyInteractedBefore =
        await ctx.db.query.userMovieInteractions.findFirst({
          where: (t, { eq, and }) =>
            and(eq(t.userId, userId), eq(t.movieId, movieId)),
        });

      if (alreadyInteractedBefore == undefined) {
        await ctx.db.insert(userMovieInteractions).values({
          userId,
          movieId,
          disliked: true,
        });
      } else {
        await ctx.db
          .update(userMovieInteractions)
          .set({
            disliked: !alreadyInteractedBefore.disliked,
          })
          .where(
            and(
              eq(userMovieInteractions.userId, userId),
              eq(userMovieInteractions.movieId, movieId),
            ),
          );
      }

      // const req = await fetch(`${FLASK_API}/get_title/${movieId}`);
      // const data = (await req.json()) as {
      //   movie_title: string;
      //   movie_id: number;
      // };

      // await ctx.db
      //   .delete(movieRecommendations)
      //   .where(
      //     and(
      //       eq(movieRecommendations.fromMovie, data.movie_title),
      //       eq(movieRecommendations.userId, userId),
      //     ),
      //   );

      return {
        success: true,
      };
    }),

  likeRec: protectedProcedure
    .input(
      z.object({
        recId: z.number(),
        model: z.string(),
        movieId: z.number(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const userId = ctx.session.user.id;
      const { model, movieId, recId } = input;
      const otherModel = model === "cf" ? "cbf" : "cf";

      const otherModelRec = await ctx.db.query.movieRecommendations.findFirst({
        where: (t, { eq, and }) =>
          and(
            eq(t.model, otherModel),
            eq(t.userId, userId),
            eq(t.movieId, movieId),
          ),
      });

      const cfWeight = (
        await ctx.db.query.users.findFirst({
          where: (t, { eq }) => eq(t.id, userId),
          columns: { cf_weight: true },
        })
      )?.cf_weight;

      if (cfWeight && cfWeight > 2 && cfWeight < 10) {
        let newWeight = otherModelRec
          ? cfWeight
          : model === "cf"
            ? cfWeight + 0.2
            : cfWeight - 0.2;

        newWeight = Math.max(2.0, Math.min(10.0, newWeight));

        const res = await fetch(
          `${FLASK_API}/recommend/${movieId}/${newWeight}`,
        );
        const data = (await res.json()) as FlaskHybridResponse;
        const { movie_title, cf, cbf } = data;

        await ctx.db
          .insert(movieRecommendations)
          .values(
            cf.map((rec) => ({
              userId,
              movieId: rec.rec_movie_id,
              model: "cf",
              fromMovie: movie_title,
              fromLike: true,
            })),
          )
          .onConflictDoNothing();

        await ctx.db
          .insert(movieRecommendations)
          .values(
            cbf.map((rec) => ({
              userId,
              movieId: rec.rec_movie_id,
              model: "cbf",
              fromMovie: movie_title,
              fromLike: true,
            })),
          )
          .onConflictDoNothing();

        if (!otherModelRec) {
          await ctx.db
            .update(users)
            .set({ cf_weight: newWeight })
            .where(eq(users.id, userId));
        }
      }

      // Mark both the current and matching other-model rec as liked
      await ctx.db
        .update(movieRecommendations)
        .set({ liked: true })
        .where(eq(movieRecommendations.id, recId));

      if (otherModelRec) {
        await ctx.db
          .update(movieRecommendations)
          .set({ liked: true })
          .where(eq(movieRecommendations.id, otherModelRec.id));
      }

      await ctx.db.insert(userMovieInteractions).values({
        liked: true,
        userId,
        movieId,
      });

      return { success: true };
    }),

  saveRec: protectedProcedure
    .input(
      z.object({
        recId: z.number(),
        model: z.string(),
        movieId: z.number(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const userId = ctx.session.user.id;
      const { model, movieId, recId } = input;
      const otherModel = model === "cf" ? "cbf" : "cf";

      const otherModelRec = await ctx.db.query.movieRecommendations.findFirst({
        where: (t, { eq, and }) =>
          and(
            eq(t.model, otherModel),
            eq(t.userId, userId),
            eq(t.movieId, movieId),
          ),
      });

      const cfWeight = (
        await ctx.db.query.users.findFirst({
          where: (t, { eq }) => eq(t.id, userId),
          columns: { cf_weight: true },
        })
      )?.cf_weight;

      if (cfWeight && cfWeight > 2 && cfWeight < 10) {
        let newWeight = otherModelRec
          ? cfWeight
          : model === "cf"
            ? cfWeight + 0.1
            : cfWeight - 0.1;

        newWeight = Math.max(2.0, Math.min(10.0, newWeight));

        const res = await fetch(
          `${FLASK_API}/recommend/${movieId}/${newWeight}`,
        );
        const data = (await res.json()) as FlaskHybridResponse;
        const { movie_title, cf, cbf } = data;

        await ctx.db
          .insert(movieRecommendations)
          .values(
            cf.map((rec) => ({
              userId,
              movieId: rec.rec_movie_id,
              model: "cf",
              fromMovie: movie_title,
              fromLike: false,
            })),
          )
          .onConflictDoNothing();

        await ctx.db
          .insert(movieRecommendations)
          .values(
            cbf.map((rec) => ({
              userId,
              movieId: rec.rec_movie_id,
              model: "cbf",
              fromMovie: movie_title,
              fromLike: false,
            })),
          )
          .onConflictDoNothing();

        if (!otherModelRec) {
          await ctx.db
            .update(users)
            .set({ cf_weight: newWeight })
            .where(eq(users.id, userId));
        }
      }

      // Mark both the current and matching other-model rec as saved
      await ctx.db
        .update(movieRecommendations)
        .set({ saved: true })
        .where(eq(movieRecommendations.id, recId));

      if (otherModelRec) {
        await ctx.db
          .update(movieRecommendations)
          .set({ saved: true })
          .where(eq(movieRecommendations.id, otherModelRec.id));
      }

      await ctx.db.insert(userMovieInteractions).values({
        saved: true,
        userId,
        movieId,
      });

      return { success: true };
    }),

  dislikeRec: protectedProcedure
    .input(
      z.object({
        recId: z.number(),
        movieId: z.number(),
        model: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const userId = ctx.session.user.id;
      const { recId, movieId, model } = input;

      const other_model_rec = await ctx.db.query.movieRecommendations.findFirst(
        {
          where: (t, { eq, and }) =>
            and(
              eq(t.userId, userId),
              eq(t.movieId, movieId),
              eq(t.model, model == "cf" ? "cbf" : "cf"),
            ),
        },
      );

      if (other_model_rec == undefined) {
        const cf_weight = (
          await ctx.db.query.users.findFirst({
            where: (users, { eq }) => eq(users.id, userId),
            columns: { cf_weight: true },
          })
        )?.cf_weight;

        if (cf_weight == undefined || cf_weight == null) {
          throw new TRPCError({
            message: "Missing cf_weight for user",
            code: "INTERNAL_SERVER_ERROR",
          });
        }

        let new_weight = 0;
        if (cf_weight > 2 && cf_weight < 10) {
          if (model == "cf") {
            new_weight = Math.max(2.0, cf_weight - 0.2);
          } else if (model == "cbf") {
            new_weight = Math.min(10.0, cf_weight + 0.2);
          }
        }

        if (new_weight != 0) {
          await ctx.db
            .update(users)
            .set({ cf_weight: new_weight })
            .where(eq(users.id, userId));
        }
      }

      await ctx.db
        .update(movieRecommendations)
        .set({
          disliked: true,
        })
        .where(eq(movieRecommendations.id, recId));

      await ctx.db
        .insert(userMovieInteractions)
        .values({ userId, movieId, disliked: true });

      // const req = await fetch(`${FLASK_API}/get_title/${movieId}`);
      // const data = (await req.json()) as {
      //   movie_title: string;
      //   movie_id: number;
      // };

      // await ctx.db
      //   .delete(movieRecommendations)
      //   .where(
      //     and(
      //       eq(movieRecommendations.fromMovie, data.movie_title),
      //       eq(movieRecommendations.userId, userId),
      //     ),
      //   );

      return {
        success: true,
      };
    }),

  getMyWeights: protectedProcedure.query(async ({ ctx }) => {
    const cf_weight = (
      await ctx.db.query.users.findFirst({
        where: (t, { eq }) => eq(t.id, ctx.session.user.id),
        columns: { cf_weight: true },
      })
    )?.cf_weight;

    if (cf_weight == null || cf_weight == undefined) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Unavailable weights for user",
      });
    }

    const cf = (cf_weight / 12) * 100;
    const cbf = 100 - cf;

    return { cf: cf.toFixed(2), cbf: cbf.toFixed(2) };
  }),

  getCollaborativeCounts: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;

    // All movie IDs recommended by the CBF model for this user
    const cbfMovieIds = await ctx.db
      .select({ movieId: movieRecommendations.movieId })
      .from(movieRecommendations)
      .where(
        and(
          eq(movieRecommendations.userId, userId),
          eq(movieRecommendations.model, "cbf"),
        ),
      );

    const excludedIds = cbfMovieIds.map((r) => r.movieId);

    const [likedResult, dislikedResult, savedResult, unseenResult] =
      await Promise.all([
        ctx.db
          .select({ count: count() })
          .from(movieRecommendations)
          .where(
            and(
              eq(movieRecommendations.model, "cf"),
              eq(movieRecommendations.userId, userId),
              eq(movieRecommendations.liked, true),
              notInArray(movieRecommendations.movieId, excludedIds),
            ),
          ),
        ctx.db
          .select({ count: count() })
          .from(movieRecommendations)
          .where(
            and(
              eq(movieRecommendations.model, "cf"),
              eq(movieRecommendations.userId, userId),
              eq(movieRecommendations.disliked, true),
              notInArray(movieRecommendations.movieId, excludedIds),
            ),
          ),
        ctx.db
          .select({ count: count() })
          .from(movieRecommendations)
          .where(
            and(
              eq(movieRecommendations.model, "cf"),
              eq(movieRecommendations.userId, userId),
              eq(movieRecommendations.saved, true),
              notInArray(movieRecommendations.movieId, excludedIds),
            ),
          ),
        ctx.db
          .select({ count: count() })
          .from(movieRecommendations)
          .where(
            and(
              eq(movieRecommendations.model, "cf"),
              eq(movieRecommendations.userId, userId),
              eq(movieRecommendations.liked, false),
              eq(movieRecommendations.saved, false),
              eq(movieRecommendations.disliked, false),
              notInArray(movieRecommendations.movieId, excludedIds),
            ),
          ),
      ]);

    const liked = likedResult[0]?.count ?? 0;
    const disliked = dislikedResult[0]?.count ?? 0;
    const saved = savedResult[0]?.count ?? 0;
    const unseen = unseenResult[0]?.count ?? 0;

    return {
      total: liked + disliked + saved + unseen,
      liked,
      disliked,
      saved,
      unseen,
    };
  }),

  getContentBasedCounts: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;

    // All movie IDs recommended by the CF model for this user
    const cfMovieIds = await ctx.db
      .select({ movieId: movieRecommendations.movieId })
      .from(movieRecommendations)
      .where(
        and(
          eq(movieRecommendations.userId, userId),
          eq(movieRecommendations.model, "cf"),
        ),
      );

    const excludedIds = cfMovieIds.map((r) => r.movieId);

    const [likedResult, dislikedResult, savedResult, unseenResult] =
      await Promise.all([
        ctx.db
          .select({ count: count() })
          .from(movieRecommendations)
          .where(
            and(
              eq(movieRecommendations.model, "cbf"),
              eq(movieRecommendations.userId, userId),
              eq(movieRecommendations.liked, true),
              notInArray(movieRecommendations.movieId, excludedIds),
            ),
          ),
        ctx.db
          .select({ count: count() })
          .from(movieRecommendations)
          .where(
            and(
              eq(movieRecommendations.model, "cbf"),
              eq(movieRecommendations.userId, userId),
              eq(movieRecommendations.disliked, true),
              notInArray(movieRecommendations.movieId, excludedIds),
            ),
          ),
        ctx.db
          .select({ count: count() })
          .from(movieRecommendations)
          .where(
            and(
              eq(movieRecommendations.model, "cbf"),
              eq(movieRecommendations.userId, userId),
              eq(movieRecommendations.saved, true),
              notInArray(movieRecommendations.movieId, excludedIds),
            ),
          ),
        ctx.db
          .select({ count: count() })
          .from(movieRecommendations)
          .where(
            and(
              eq(movieRecommendations.model, "cbf"),
              eq(movieRecommendations.userId, userId),
              eq(movieRecommendations.liked, false),
              eq(movieRecommendations.saved, false),
              eq(movieRecommendations.disliked, false),
              notInArray(movieRecommendations.movieId, excludedIds),
            ),
          ),
      ]);

    const liked = likedResult[0]?.count ?? 0;
    const disliked = dislikedResult[0]?.count ?? 0;
    const saved = savedResult[0]?.count ?? 0;
    const unseen = unseenResult[0]?.count ?? 0;

    return {
      total: liked + disliked + saved + unseen,
      liked,
      disliked,
      saved,
      unseen,
    };
  }),

  getBothModelRecsCounts: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;

    // Step 1: Get only movieIds that were recommended by BOTH cf and cbf
    const sharedMovies = await ctx.db
      .select({ movieId: movieRecommendations.movieId })
      .from(movieRecommendations)
      .where(
        and(
          eq(movieRecommendations.userId, userId),
          inArray(movieRecommendations.model, ["cf", "cbf"]),
        ),
      )
      .groupBy(movieRecommendations.movieId)
      .having(sql`COUNT(DISTINCT model) = 2`);

    const sharedMovieIds = sharedMovies.map((row) => row.movieId);

    // Guard clause in case there's nothing shared
    if (sharedMovieIds.length === 0) {
      return { total: 0, liked: 0, disliked: 0, saved: 0, unseen: 0 };
    }

    // Step 2: Define a helper to DRY up repeated logic
    const countInteraction = async (
      interactionField: "liked" | "disliked" | "saved",
      value: boolean,
    ) => {
      const result = await ctx.db
        .select({ count: count() })
        .from(movieRecommendations)
        .where(
          and(
            eq(movieRecommendations.model, "cbf"),
            eq(movieRecommendations.userId, userId),
            eq(movieRecommendations[interactionField], value),
            inArray(movieRecommendations.movieId, sharedMovieIds),
          ),
        );
      return result[0]?.count ?? 0;
    };

    // Step 3: Count each interaction
    const [liked, disliked, saved] = await Promise.all([
      countInteraction("liked", true),
      countInteraction("disliked", true),
      countInteraction("saved", true),
    ]);

    // Step 4: Count unseen (no interactions)
    const unseenResult = await ctx.db
      .select({ count: count() })
      .from(movieRecommendations)
      .where(
        and(
          eq(movieRecommendations.model, "cbf"),
          eq(movieRecommendations.userId, userId),
          eq(movieRecommendations.liked, false),
          eq(movieRecommendations.disliked, false),
          eq(movieRecommendations.saved, false),
          inArray(movieRecommendations.movieId, sharedMovieIds),
        ),
      );

    const unseen = unseenResult[0]?.count ?? 0;

    return {
      total: liked + disliked + saved + unseen,
      liked,
      disliked,
      saved,
      unseen,
    };
  }),

  getLikedCount: protectedProcedure.query(async ({ ctx }) => {
    const res = await ctx.db
      .select({ count: count() })
      .from(userMovieInteractions)
      .where(
        and(
          eq(userMovieInteractions.userId, ctx.session.user.id),
          eq(userMovieInteractions.liked, true),
        ),
      );

    return res[0]?.count ?? 0;
  }),

  getDislikedCount: protectedProcedure.query(async ({ ctx }) => {
    const res = await ctx.db
      .select({ count: count() })
      .from(userMovieInteractions)
      .where(
        and(
          eq(userMovieInteractions.userId, ctx.session.user.id),
          eq(userMovieInteractions.disliked, true),
        ),
      );

    return res[0]?.count ?? 0;
  }),

  getSavedCount: protectedProcedure.query(async ({ ctx }) => {
    const res = await ctx.db
      .select({ count: count() })
      .from(userMovieInteractions)
      .where(
        and(
          eq(userMovieInteractions.userId, ctx.session.user.id),
          eq(userMovieInteractions.saved, true),
        ),
      );

    return res[0]?.count ?? 0;
  }),
});

// END OF ROUTER - OLD PROCEDURE BELOW
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

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
