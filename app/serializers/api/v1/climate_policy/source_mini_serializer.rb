module Api
  module V1
    module ClimatePolicy
      class SourceMiniSerializer < ActiveModel::Serializer
        attributes :code, :link
      end
    end
  end
end
