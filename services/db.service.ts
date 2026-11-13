import { Pool, PoolClient, QueryResult, QueryResultRow } from 'pg';
import { config } from '../config/index';
import { loggerService } from './logger.service';

let pool: Pool | null = null;
const isMockMode = !config.postgresURL || config.postgresURL.trim() === '';

if (isMockMode) {
    loggerService.warn('⚡ POSTGRES_URL is not set. Operating in Zero-Config Mock DB mode for local testing.');
}

function getPool(): Pool {
    if (isMockMode) {
        throw new Error('Database is in Mock DB mode. Direct PostgreSQL pool query is not available.');
    }

    if (!pool) {
        const url = config.postgresURL;
        const isLocal = url.includes('localhost') || url.includes('127.0.0.1') || url.includes('sslmode=disable');

        let ssl: false | { rejectUnauthorized: boolean; ca?: string } = false;
        if (!isLocal) {
            const caCert = process.env.POSTGRES_CA_CERT;
            if (caCert) {
                ssl = { rejectUnauthorized: true, ca: caCert };
            } else {
                ssl = { rejectUnauthorized: process.env.POSTGRES_SSL_VERIFY === 'true' };
            }
        }

        pool = new Pool({
            connectionString: url,
            ssl,
            max: 20,
            idleTimeoutMillis: 30000,
            connectionTimeoutMillis: 10000
        });

        pool.on('error', (err) => {
            loggerService.error('Unexpected error on idle PostgreSQL client', err);
        });
    }
    return pool;
}

async function query<T extends QueryResultRow = QueryResultRow>(text: string, params?: unknown[]): Promise<QueryResult<T>> {
    const currentPool = getPool();
    try {
        const res = await currentPool.query<T>(text, params);
        return res;
    } catch (err) {
        loggerService.error('PostgreSQL query error', { text, error: err instanceof Error ? err.message : err });
        throw err;
    }
}

async function getClient(): Promise<PoolClient> {
    const currentPool = getPool();
    return await currentPool.connect();
}

async function close(): Promise<void> {
    if (pool) {
        await pool.end();
        pool = null;
        loggerService.info('PostgreSQL connection pool closed.');
    }
}

export const dbService = {
    query,
    getClient,
    close,
    isMockMode: () => isMockMode
};
