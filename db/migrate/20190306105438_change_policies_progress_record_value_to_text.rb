class ChangePoliciesProgressRecordValueToText < ActiveRecord::Migration[5.2]
  def change
    remove_column :climate_policy_progress_records, :value, :float
    add_column :climate_policy_progress_records, :value, :text
  end
end
