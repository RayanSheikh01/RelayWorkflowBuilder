import Database from 'better-sqlite3';
import { interpolate } from '../../src/utils/templateEngine.js';

export async function handle(data, inputs) {
    const dbPath = interpolate(data.database || ':memory:', inputs);
    const query = interpolate(data.query || '', inputs);
    
    try {
        const db = new Database(dbPath);
        if (query.trim().toLowerCase().startsWith('select')) {
            const rows = db.prepare(query).all();
            db.close();
            return { output: JSON.stringify(rows) };
        } else {
            const info = db.prepare(query).run();
            db.close();
            return { output: `Changes: ${info.changes}, Last Insert ID: ${info.lastInsertRowid}` };
        }
    } catch (error) {
        throw new Error(`Database Error: ${error.message}`);
    }
}
