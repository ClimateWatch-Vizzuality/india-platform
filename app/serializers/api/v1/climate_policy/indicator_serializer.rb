module Api
  module V1
    module ClimatePolicy
      class IndicatorSerializer < ActiveModel::Serializer
        attribute :name, key: :title
        attributes :category, :attainment_date, :value,
                   :responsible_authority,
                   :tracking_frequency, :tracking_notes,
                   :status, :sources, :updated_at

        def sources
          object.sources.map(&:link).join(' ')
        end
      end
    end
  end
end
