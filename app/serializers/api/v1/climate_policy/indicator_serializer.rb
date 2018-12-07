module Api
  module V1
    module ClimatePolicy
      class IndicatorSerializer < ActiveModel::Serializer
        attributes :category, :name, :attainment_date, :value,
                   :responsible_authority, :data_source_link,
                   :tracking_frequency, :tracking_notes,
                   :status, :sources
      end
    end
  end
end
