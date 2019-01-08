class CreateSocioeconomicTables < ActiveRecord::Migration[5.2]
  def change
    create_table :socioeconomic_indicators do |t|
      t.string :code, null: false
      t.string :name, null: false
      t.string :unit, null: false
      t.string :category
      t.string :definition

      t.timestamps
    end
    add_index :socioeconomic_indicators, :code, unique: true

    create_table :socioeconomic_values do |t|
      t.references :location, foreign_key: {on_delete: :cascade}, index: true
      t.references :indicator, foreign_key: {
                     to_table: :socioeconomic_indicators,
                     on_delete: :cascade
                   }, index: true
      t.string :category
      t.string :source
      t.jsonb :values

      t.timestamps
    end
  end
end
