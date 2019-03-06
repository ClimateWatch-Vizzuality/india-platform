module Api
  module V1
    module ClimatePolicy
      class ProgressRecordSerializer < ActiveModel::Serializer
        attributes :axis_x, :category, :value, :target

        def value
          return object.value.to_f unless object.indicator.text?

          object.value
        end

        def category
          object.category || 'Reporting value'
        end
      end
    end
  end
end
