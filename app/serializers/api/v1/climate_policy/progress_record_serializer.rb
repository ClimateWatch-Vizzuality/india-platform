module Api
  module V1
    module ClimatePolicy
      class ProgressRecordSerializer < ActiveModel::Serializer
        attributes :axis_x, :category, :value, :target

        def category
          object.category || 'Reporting value'
        end
      end
    end
  end
end
