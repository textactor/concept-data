
import test from 'ava';
import { unixTimestamp } from './helpers';

test('unixTimestamp', t => {
    t.is(unixTimestamp(), Math.round(Date.now() / 1000));
})
