import { ClientFunction } from 'testcafe';

export const refreshPage = async () => {
  await ClientFunction(() => document.location.reload())();
};
