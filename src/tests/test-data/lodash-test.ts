// Test for lodash detection
import { cloneDeep, isEmpty } from 'lodash';
const original = { a: 1 };
const copy = cloneDeep(original);
if (!isEmpty(copy)) {
    // AUTO-HUSH: console.log("Copied successfully");
}

