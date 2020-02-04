module Api
  module V1
    class ClimateFinanceSerializer < ActiveModel::Serializer
      attributes :source, :year, :value, :unit
    end
  end
end
