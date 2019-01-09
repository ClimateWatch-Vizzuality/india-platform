module Api
  module V1
    module Socioeconomic
      class IndicatorSerializer < ActiveModel::Serializer
        attributes :code, :category, :name, :unit
      end
    end
  end
end
