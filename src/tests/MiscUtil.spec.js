import { expect } from 'chai';
import MiscUtil from '../utils/MiscUtil';

describe('Misc Utils', () => {
    describe('generateStringFromSet', () => {
        it('returns a space separated string from a set of strings mapped to booleans', () => {
            // our string set
            let stringSet = {
                "foo": true,
                "bar": false,
                "fubar": true
            };

            //assert
            expect(MiscUtil.generateStringFromSet(stringSet)).to.equal('foo fubar');
        });

        it('handles only string booleans (true/false)', () => {
            // our string set
            let stringSet = {
                "foo": 1,
                "bar": true,
                "fubar": "true"
            };

            //assert
            expect(MiscUtil.generateStringFromSet(stringSet)).to.equal('bar');
        });

        it('returns empty string if no strings map to true', () => {
            // our string set
            let stringSet = {
                "foo": false,
                "bar": false,
                "fubar": false
            };

            //assert
            expect(MiscUtil.generateStringFromSet(stringSet)).to.equal('');
        });
    });
});
