module Api
  module V1
    module ClimatePolicy
      class SourceSerializer < ActiveModel::Serializer
        attributes :code, :name, :description, :link
      end
    end
  end
end
