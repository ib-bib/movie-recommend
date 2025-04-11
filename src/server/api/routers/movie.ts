import { eq } from "drizzle-orm";
import { z } from "zod";

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

export const movieRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    return await ctx.db.query.movies.findMany({
      orderBy: (movies, { asc }) => [asc(movies.bayesianRating)],
    });
  }),

  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input, ctx }) => {
      return await ctx.db.query.movies.findFirst({
        where: (movies, { eq }) => eq(movies.id, input.id),
      });
    }),

  likeMovie: protectedProcedure
    .input(z.object({ id: z.number(), title: z.string(), year: z.number() }))
    .mutation(async ({ input, ctx }) => {
      await fetch(
        `http://localhost:5000/recommend/${input.title + " " + input.year}`,
      );

      await ctx.db.insert(userMovieInteractions).values({
        userId: ctx.session.user.id,
        movieId: input.id,
        liked: true,
      });
    }),

  dislikeMovie: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input, ctx }) => {
      await ctx.db.insert(userMovieInteractions).values({
        userId: ctx.session.user.id,
        movieId: input.id,
        disliked: true,
      });
    }),

  saveMovie: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input, ctx }) => {
      await ctx.db.insert(userMovieInteractions).values({
        userId: ctx.session.user.id,
        movieId: input.id,
        saved: true,
      });
    }),

  likeRec: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
        recId: z.number(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      await ctx.db
        .update(movieRecommendations)
        .set({
          liked: true,
        })
        .where(eq(movieRecommendations.id, input.recId));

      await ctx.db
        .update(users)
        .set({ cf_weight: users.cf_weight })
        .where(eq(users.id, input.userId));
    }),

  dislikeRec: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
        recId: z.number(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      await ctx.db
        .update(movieRecommendations)
        .set({
          liked: true,
        })
        .where(eq(movieRecommendations.id, input.recId));

      await ctx.db
        .update(users)
        .set({ cf_weight: users.cf_weight })
        .where(eq(users.id, input.userId));
    }),
});
