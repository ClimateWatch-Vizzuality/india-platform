module Api
  module V1
    module ClimatePolicy
      class IndicatorSerializer < ActiveModel::Serializer
        attribute :name, key: :title
        attributes :category, :attainment_date, :value,
                   :responsible_authority,
                   :tracking_frequency, :tracking_notes,
                   :status, :updated_at

        has_many :sources, serializer: Api::V1::ClimatePolicy::SourceMiniSerializer
      end
    end
  end
end
