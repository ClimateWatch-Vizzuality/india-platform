class RemoveCodeFromClimatePolicyInstruments < ActiveRecord::Migration[5.2]
  def change
    remove_column :climate_policy_instruments, :code, :string
  end
end
