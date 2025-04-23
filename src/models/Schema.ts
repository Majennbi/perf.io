import {
  bigint,
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
} from 'drizzle-orm/pg-core';

// This file defines the structure of your database tables using the Drizzle ORM.

// To modify the database schema:
// 1. Update this file with your desired changes.
// 2. Generate a new migration by running: `npm run db:generate`

// The generated migration file will reflect your schema changes.
// The migration is automatically applied during the next database interaction,
// so there's no need to run it manually or restart the Next.js server.

export const organizationSchema = pgTable(
  'organization',
  {
    id: text('id').primaryKey(),
    stripeCustomerId: text('stripe_customer_id'),
    stripeSubscriptionId: text('stripe_subscription_id'),
    stripeSubscriptionPriceId: text('stripe_subscription_price_id'),
    stripeSubscriptionStatus: text('stripe_subscription_status'),
    stripeSubscriptionCurrentPeriodEnd: bigint(
      'stripe_subscription_current_period_end',
      { mode: 'number' },
    ),
    updatedAt: timestamp('updated_at', { mode: 'date' })
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
    createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
  },
  (table) => {
    return {
      stripeCustomerIdIdx: uniqueIndex('stripe_customer_id_idx').on(
        table.stripeCustomerId,
      ),
    };
  },
);

export const clientSchema = pgTable('client', {
  id: serial('id').primaryKey(),
  ownerId: text('owner_id').notNull(),
  name: text('name').notNull(),
  email: text('email'),
  phone: text('phone'),
  company: text('company'),
  notes: text('notes'),
  updatedAt: timestamp('updated_at', { mode: 'date' })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
});

export const todoSchema = pgTable('todo', {
  id: serial('id').primaryKey(),
  ownerId: text('owner_id').notNull(),
  title: text('title').notNull(),
  message: text('message').notNull(),
  updatedAt: timestamp('updated_at', { mode: 'date' })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
});

export const projectSchema = pgTable('project', {
  id: serial('id').primaryKey(),
  ownerId: text('owner_id').notNull(),
  clientId: serial('client_id').references(() => clientSchema.id),
  name: text('name').notNull(),
  description: text('description'),
  status: text('status').notNull().default('en_cours'), // en_cours, termine, pause
  startDate: timestamp('start_date', { mode: 'date' }).notNull(),
  endDate: timestamp('end_date', { mode: 'date' }),
  budget: bigint('budget', { mode: 'number' }),
  dailyRate: bigint('daily_rate', { mode: 'number' }), // Taux journalier (TJ)
  serviceType: text('service_type'), // Type de prestation (développement, design, conseil, etc.)
  rhythm: text('rhythm'), // Rythme du projet (temps plein, mi-temps, ponctuel, etc.)
  workdaysPerMonth: bigint('workdays_per_month', { mode: 'number' }), // Nombre de jours travaillés par mois
  updatedAt: timestamp('updated_at', { mode: 'date' })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
});
