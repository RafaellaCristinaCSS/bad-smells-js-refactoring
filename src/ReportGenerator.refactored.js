class ReportGenerator {
    constructor(options = {}) {
        this.options = options;
    }

    generateReport(format, user, items = []) {
        const normalizedItems = this._normalizeItems(items);
        const payload = {
            metadata: this._buildMetadata(user, normalizedItems),
            items: normalizedItems,
            totals: this._computeTotals(normalizedItems)
        };

        switch ((format || 'JSON').toUpperCase()) {
            case 'CSV':
                return this._toCSV(payload);
            case 'JSON':
            default:
                return this._toJSON(payload);
        }
    }
    _normalizeItems(items) {

        return (items || []).map(item => ({
            id: item.id ?? item.ID ?? null,
            name: item.name ?? item.NOME ?? item.title ?? '',
            value: Number(item.value ?? item.VALOR ?? 0),
            user: item.user ?? item.USUARIO ?? null,
            extra: item.extra ?? null
        }));
    }

    _buildMetadata(user, items) {
        return {
            generatedBy: user?.name ?? user ?? 'unknown',
            generatedAt: new Date().toISOString(),
            count: items.length
        };
    }

    _computeTotals(items) {

        let total = 0;
        for (const it of items) {
            total += Number(it.value || 0);
        }
        return { total };
    }

    _toJSON(payload) {
        return JSON.stringify(payload, null, 2);
    }

    _toCSV(payload) {

        const header = ['ID', 'NOME', 'VALOR', 'USUARIO'];
        const lines = [header.join(',')];
        for (const it of payload.items) {
            const row = [
                this._escapeCsv(String(it.id ?? '')),
                this._escapeCsv(String(it.name ?? '')),
                this._escapeCsv(String(it.value ?? '0')),
                this._escapeCsv(String(it.user ?? ''))
            ];
            lines.push(row.join(','));
        }
        return lines.join('\n');
    }

    _escapeCsv(value) {
        if (value.includes(',') || value.includes('"') || value.includes('\n')) {
            return '"' + value.replace(/"/g, '""') + '"';
        }
        return value;
    }
}

export default ReportGenerator;
