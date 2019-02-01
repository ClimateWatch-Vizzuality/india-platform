class CreateTranslations < ActiveRecord::Migration[5.2]
  def change
    # for text management even if there is only one language now
    create_table :translations do |t|
      t.string :locale
      t.string :key
      t.text   :value
      t.text   :interpolations
      t.boolean :is_proc, :default => false

      t.timestamps
    end
  end
end
