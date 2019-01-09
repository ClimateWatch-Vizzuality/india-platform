module Api
  module V1
    module Socioeconomic
      class ValueSerializer < ActiveModel::Serializer
        attribute :indicator_code
        attribute :location
        attribute :location_iso_code3
        attribute :category
        attribute :values
        attribute :source

        def location
          object.location.wri_standard_name
        end

        def location_iso_code3
          object.location.iso_code3
        end

        def indicator_code
          object.indicator.code
        end
      end
    end
  end
end
