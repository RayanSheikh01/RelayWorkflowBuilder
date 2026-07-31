import nodemailer from 'nodemailer';
import { interpolate } from '../../src/utils/templateEngine.js';

export async function handle(data, inputs) {
    const transporter = nodemailer.createTransport({
        host: interpolate(data.host || '', inputs),
        port: parseInt(interpolate(data.port || '587', inputs)),
        auth: {
            user: interpolate(data.user || '', inputs),
            pass: interpolate(data.pass || '', inputs)
        }
    });

    try {
        const info = await transporter.sendMail({
            from: interpolate(data.user || '', inputs),
            to: interpolate(data.to || '', inputs),
            subject: interpolate(data.subject || '', inputs),
            text: interpolate(data.body || '', inputs)
        });
        
        return { output: info.messageId };
    } catch (error) {
        throw new Error(`Email Error: ${error.message}`);
    }
}
