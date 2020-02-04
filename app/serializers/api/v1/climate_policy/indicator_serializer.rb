module Api
  module V1
    module ClimatePolicy
      class IndicatorSerializer < ActiveModel::Serializer
        attribute :name, key: :title
        attributes :code, :category, :attainment_date, :unit,
                   :responsible_authority,
                   :target_numeric, :target_text, :target_year,
                   :tracking_frequency, :tracking_notes, :status,
                   :progress_display, :progress_records,
                   :source_ids, :updated_at

        has_many :progress_records, serialize: Api::V1::ClimatePolicy::ProgressRecordSerializer
      end
    end
  end
end
