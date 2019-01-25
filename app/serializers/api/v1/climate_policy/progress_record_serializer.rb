module Api
  module V1
    module ClimatePolicy
      class ProgressRecordSerializer < ActiveModel::Serializer
        attributes :axis_x, :category, :value, :target
      end
    end
  end
end
