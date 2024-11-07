import { expect, test, } from 'vitest';
import path from 'path';
import { addFileToClientSpaceIfExists } from './index';

test('Test index.ts', async () => {
    await addFileToClientSpaceIfExists(
        'First Name',
        'Last Name',
        'test@example.com',
        // using package.json as an example file that you can upload -- could be anything like a PDF/XLSX/DOC/JPG/SVG/etc...
        path.resolve(__dirname, '../package.json'),
    )
});