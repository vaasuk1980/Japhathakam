import test from 'node:test';
import assert from 'node:assert/strict';

import { buildAstronomicalPlaceSummary } from '../helpers/astronomicalPlaces.js';

test('buildAstronomicalPlaceSummary returns graha placement details', () => {
    const renderLayout = {
        cells: [
            {
                sthana: 1,
                regions: [
                    {
                        padaGroups: [
                            {
                                pada: 1,
                                grahas: [
                                    {
                                        id: '1',
                                        displayName: 'సు',
                                        name: 'SURYA',
                                        longitude: 123.45,
                                        nakshatra: 'ROHINI',
                                        pada: 1,
                                        sthana: 1
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        ]
    };

    const summary = buildAstronomicalPlaceSummary(renderLayout);

    assert.equal(summary.length, 1);
    assert.equal(summary[0].displayName, 'సు');
    assert.equal(summary[0].formattedLongitude, '123° 27\' 00"');
    assert.equal(summary[0].nakshatra, 'ROHINI');
    assert.equal(summary[0].pada, 1);
    assert.equal(summary[0].sthana, 1);
});
