module Api
  module V1
    module ClimatePolicy
      class IndicatorSerializer < ActiveModel::Serializer
        attribute :name, key: :title
        attributes :category, :attainment_date, :value,
                   :responsible_authority, :data_source_link,
                   :tracking_frequency, :tracking_notes,
                   :status, :sources
      end
    end
  end
end
