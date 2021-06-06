import { pickBy } from 'ramda';

import { UpdateUserInput } from '../../graphql/inputs';
import admin from '../../services/firebase';

/**
 * Convert `UpdateUserInput` to `UpdateRequest` input.
 *
 * Clean all `undefined` values from `updates`.
 *
 * @param {UpdateUserInput} updates
 * @returns {admin.auth.UpdateRequest} updates
 */
const toUpdateRequest = (
  updates: UpdateUserInput
): admin.auth.UpdateRequest => {
  const { username, email, phone, password, photoURL, isDisabled } = updates;

  // clean "undefined" values from updates
  return pickBy((value) => typeof value !== 'undefined', {
    displayName: username,
    photoURL,
    disabled: isDisabled,
    email,
    phoneNumber: phone,
    password
  });
};

export default toUpdateRequest;
