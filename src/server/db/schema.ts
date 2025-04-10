import { relations, sql } from "drizzle-orm";
import { index, pgTableCreator, primaryKey, unique } from "drizzle-orm/pg-core";
import { type AdapterAccount } from "next-auth/adapters";

export const createTable = pgTableCreator((name) => `movie-rec_${name}`);

export const users = createTable("user", (d) => ({
  id: d
    .varchar({ length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: d.varchar({ length: 255 }),
  email: d.varchar({ length: 255 }).notNull(),
  emailVerified: d
    .timestamp({
      mode: "date",
      withTimezone: true,
    })
    .default(sql`CURRENT_TIMESTAMP`),
  image: d.varchar({ length: 255 }),
  cf_weight: d.doublePrecision().default(6.0),
}));

export const accounts = createTable(
  "account",
  (d) => ({
    userId: d
      .varchar({ length: 255 })
      .notNull()
      .references(() => users.id),
    type: d.varchar({ length: 255 }).$type<AdapterAccount["type"]>().notNull(),
    provider: d.varchar({ length: 255 }).notNull(),
    providerAccountId: d.varchar({ length: 255 }).notNull(),
    refresh_token: d.text(),
    access_token: d.text(),
    expires_at: d.integer(),
    token_type: d.varchar({ length: 255 }),
    scope: d.varchar({ length: 255 }),
    id_token: d.text(),
    session_state: d.varchar({ length: 255 }),
  }),
  (t) => [
    primaryKey({ columns: [t.provider, t.providerAccountId] }),
    index("account_user_id_idx").on(t.userId),
  ],
);

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, { fields: [accounts.userId], references: [users.id] }),
}));

export const sessions = createTable(
  "session",
  (d) => ({
    sessionToken: d.varchar({ length: 255 }).notNull().primaryKey(),
    userId: d
      .varchar({ length: 255 })
      .notNull()
      .references(() => users.id),
    expires: d.timestamp({ mode: "date", withTimezone: true }).notNull(),
  }),
  (t) => [index("t_user_id_idx").on(t.userId)],
);

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}));

export const verificationTokens = createTable(
  "verification_token",
  (d) => ({
    identifier: d.varchar({ length: 255 }).notNull(),
    token: d.varchar({ length: 255 }).notNull(),
    expires: d.timestamp({ mode: "date", withTimezone: true }).notNull(),
  }),
  (t) => [primaryKey({ columns: [t.identifier, t.token] })],
);

export const movies = createTable(
  "movie",
  (d) => ({
    id: d.integer().primaryKey().generatedByDefaultAsIdentity(),
    movieId: d.integer().unique(),
    title: d.varchar({ length: 200 }),
    image: d.varchar({ length: 500 }),
    meanRating: d.doublePrecision(),
    bayesianRating: d.doublePrecision(),
    releaseYear: d.integer(),
  }),
  (t) => [
    index("movie_title_idx").on(t.title),
    index("movie_release_year_idx").on(t.releaseYear),
  ],
);

export const genres = createTable("genre", (d) => ({
  id: d.integer().primaryKey().generatedByDefaultAsIdentity(),
  name: d.varchar({ length: 255 }).unique(),
}));

export const movie_genres = createTable(
  "movie_genre",
  (d) => ({
    id: d.integer().primaryKey().generatedByDefaultAsIdentity(),
    movieId: d.integer().references(() => movies.movieId),
    genreId: d.integer().references(() => genres.id),
  }),
  (t) => [
    unique("unique_movie_genre").on(t.movieId, t.genreId),
    index("movie_genre_movie_idx").on(t.movieId),
  ],
);

export const movieGenresRelations = relations(movie_genres, ({ one }) => ({
  movie: one(movies, {
    fields: [movie_genres.movieId],
    references: [movies.movieId],
  }),
  genre: one(genres, {
    fields: [movie_genres.genreId],
    references: [genres.id],
  }),
}));

export const movieRecommendations = createTable(
  "movie_recommendation",
  (d) => ({
    id: d.integer().primaryKey().generatedByDefaultAsIdentity(),
    userId: d
      .varchar({ length: 255 })
      .notNull()
      .references(() => users.id),
    movieId: d
      .integer()
      .notNull()
      .references(() => movies.movieId),
    model: d.varchar({ length: 3 }).notNull(), // "cf" or "cbf"
    liked: d.boolean().default(false),
    disliked: d.boolean().default(false),
    saved: d.boolean().default(false),
    recommendedAt: d
      .timestamp({ withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`),
  }),
  (t) => [
    index("movie_recommendation_user_idx").on(t.userId),
    index("movie_recommendation_movie_idx").on(t.movieId),
    index("movie_recommendation_model_idx").on(t.model),
    index("movie_recommendation_liked_idx").on(t.liked),
    index("movie_recommendation_disliked_idx").on(t.disliked),
    index("movie_recommendation_saved_idx").on(t.saved),
    unique("unique_movie_recommendation").on(t.userId, t.movieId, t.model),
  ],
);

export const movieRecommendationsRelations = relations(
  movieRecommendations,
  ({ one }) => ({
    user: one(users, {
      fields: [movieRecommendations.userId],
      references: [users.id],
    }),
    movie: one(movies, {
      fields: [movieRecommendations.movieId],
      references: [movies.movieId],
    }),
  }),
);

export const userMovieInteractions = createTable(
  "user_movie_interaction",
  (d) => ({
    id: d.integer().primaryKey().generatedByDefaultAsIdentity(),
    userId: d
      .varchar({ length: 255 })
      .notNull()
      .references(() => users.id),
    movieId: d
      .integer()
      .notNull()
      .references(() => movies.movieId),
    liked: d.boolean().default(false),
    disliked: d.boolean().default(false),
    saved: d.boolean().default(false),
    interactedAt: d
      .timestamp({ withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`),
  }),
  (t) => [
    index("user_movie_interaction_user_idx").on(t.userId),
    index("user_movie_interaction_movie_idx").on(t.movieId),
    index("user_movie_interaction_liked_idx").on(t.liked),
    index("user_movie_interaction_disliked_idx").on(t.disliked),
    index("user_movie_interaction_saved_idx").on(t.saved),
  ],
);

export const userMovieInteractionsRelations = relations(
  userMovieInteractions,
  ({ one }) => ({
    user: one(users, {
      fields: [userMovieInteractions.userId],
      references: [users.id],
    }),
    movie: one(movies, {
      fields: [userMovieInteractions.movieId],
      references: [movies.movieId],
    }),
  }),
);

export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
  recommendations: many(movieRecommendations),
  interactions: many(userMovieInteractions),
}));

export const moviesRelations = relations(movies, ({ many }) => ({
  genres: many(movie_genres),
  recommendations: many(movieRecommendations),
  interactions: many(userMovieInteractions),
}));

export const genresRelations = relations(genres, ({ many }) => ({
  movies: many(movie_genres),
}));
