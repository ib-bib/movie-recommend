import { relations, sql } from "drizzle-orm";
import { index, pgTableCreator, primaryKey, unique } from "drizzle-orm/pg-core";
import { type AdapterAccount } from "next-auth/adapters";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `movie-rec_${name}`);

// export const posts = createTable(
//   "post",
//   (d) => ({
//     id: d.integer().primaryKey().generatedByDefaultAsIdentity(),
//     name: d.varchar({ length: 256 }),
//     createdById: d
//       .varchar({ length: 255 })
//       .notNull()
//       .references(() => users.id),
//     createdAt: d
//       .timestamp({ withTimezone: true })
//       .default(sql`CURRENT_TIMESTAMP`)
//       .notNull(),
//     updatedAt: d.timestamp({ withTimezone: true }).$onUpdate(() => new Date()),
//   }),
//   (t) => [
//     index("created_by_idx").on(t.createdById),
//     index("name_idx").on(t.name),
//   ],
// );

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

export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
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

export const movies = createTable("movie", (d) => ({
  id: d.integer().primaryKey().generatedByDefaultAsIdentity(),
  movieId: d.integer().unique(),
  title: d.varchar({ length: 200 }),
  image: d.varchar({ length: 500 }),
  meanRating: d.doublePrecision(),
  bayesianRating: d.doublePrecision(),
  releaseYear: d.integer(),
}));

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
  (t) => [unique("unique_movie_genre").on(t.movieId, t.genreId)],
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

export const moviesRelations = relations(movies, ({ many }) => ({
  genres: many(movie_genres),
}));

export const genresRelations = relations(genres, ({ many }) => ({
  movies: many(movie_genres),
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
    recommendedAt: d
      .timestamp({ withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`),
  }),
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
