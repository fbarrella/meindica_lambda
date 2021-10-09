const { GoogleSpreadsheet } = require('google-spreadsheet');

exports.handler = async (event, context) => {
    let body;
    let statusCode = '200';
    const headers = {
        'Content-Type': 'application/json',
    };

    try {
        if(event.httpMethod == 'GET') {
            const spreadsheetId = 'SPREADSHEET ID';
			const sheetId = 'SHEET ID'
			const API_KEY = 'API KEY';
			const doc = new GoogleSpreadsheet(spreadsheetId);
			doc.useApiKey(API_KEY);
			await doc.loadInfo();

			const sheet = doc.sheetsById[sheetId];
			await sheet.loadHeaderRow();
			const rows = await sheet.getRows();

			let jsonRes = rows.reduce((acc, row) => {
				const cleanRow = {};
				const rowEntries = Object.entries(row);

				rowEntries.forEach(([key, value]) => {
					if (key.charAt(0) !== "_") {
						cleanRow[key] = value;
					}
				})

				acc.push(cleanRow);
				return acc;
			}, []);

			body = jsonRes;
        }else{
            throw new Error(`Unsupported method "${event.httpMethod}"`);
        }
    } catch (err) {
        statusCode = '400';
        body = err.message;
    } finally {
        body = JSON.stringify(body);
    }

    return {
        statusCode,
        body,
        headers,
    };
};