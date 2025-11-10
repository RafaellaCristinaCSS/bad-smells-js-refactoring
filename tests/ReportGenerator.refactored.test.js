import ReportGenerator from '../src/ReportGenerator.refactored.js';

const adminUser = { name: 'Admin' };
const testItems = [
    { id: 1, name: 'Produto A', value: 300, user: 'Admin' },
    { id: 2, name: 'Produto B', value: 200, user: 'Admin' }
];

describe('Admin User (refactored)', () => {
    it('deve gerar um relatório CSV completo para Admin', () => {
        const generator = new ReportGenerator();
        const report = generator.generateReport('CSV', adminUser, JSON.parse(JSON.stringify(testItems)));

        expect(report).toContain('ID,NOME,VALOR,USUARIO');
        expect(report).toContain('1,Produto A,300,Admin');
        expect(report).toContain('2,Produto B,200,Admin');
    });

    it('deve gerar JSON quando solicitado', () => {
        const generator = new ReportGenerator();
        const json = generator.generateReport('JSON', adminUser, testItems);
        const parsed = JSON.parse(json);
        expect(parsed.metadata.generatedBy).toBe('Admin');
        expect(parsed.totals.total).toBe(500);
    });
});
