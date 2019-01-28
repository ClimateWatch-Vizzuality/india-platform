class TextEntry
  include ActiveModel::Model

  attr_accessor :key, :en_value

  def identifier
    pages_regex = /(?<=pages\.)([^\.]+)/

    key.delete_prefix('app.').gsub(pages_regex, &:upcase).delete_prefix('pages.')
  end

  def save
    ActiveRecord::Base.transaction do
      save_entry(en_value, locale: :en) unless en_value.nil?
    end
    I18n.backend.reload!

    true
  end

  class << self
    def all
      en_translations = I18n.t('app', locale: :en).flatten_to_root

      translation_keys_sorted.map do |key|
        TextEntry.new(
          key: "app.#{key}",
          en_value: en_translations[key]
        )
      end
    end

    def find_by(params)
      key = params[:key]&.to_s
      en_value = params[:en_value]&.downcase
      empty_only = params[:empty_only]

      res = all
      res = res.select { |te| te.en_value.blank? || te.id_value.blank? } if empty_only
      res = res.select { |te| te.key.to_s.include?(key) } if key.present?
      res = res.select { |te| te.en_value&.downcase&.include?(en_value) } if en_value.present?

      res
    end

    private

    def translation_keys_sorted
      I18n.backend.backends.last.translations[:en][:app].flatten_to_root.keys
    end
  end

  private

  def save_entry(value, locale:)
    t = Translation.find_or_initialize_by(key: key, locale: locale)
    t.value = value
    t.save!
  end
end
