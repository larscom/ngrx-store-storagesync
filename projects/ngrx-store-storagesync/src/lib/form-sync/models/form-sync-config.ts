export interface IFormSyncConfig {
  /**
   * Only sync to the store when submitting the form.
   */
  syncOnSubmit?: boolean;
  /**
   * Only sync to the store when the form status is valid.
   */
  syncValidOnly?: boolean;
  /**
   * Sync the raw form value to the store (this will include disabled form controls)
   */
  syncRawValue?: boolean;
}
