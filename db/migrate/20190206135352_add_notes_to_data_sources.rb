class AddNotesToDataSources < ActiveRecord::Migration[5.2]
  def change
    add_column :data_sources, :notes, :text
  end
end
