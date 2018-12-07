module Api
  module V1
    module ClimatePolicy
      class PolicyFullSerializer < ActiveModel::Serializer
        attributes :code, :policy_type, :sector, :description, :title,
                   :authority, :tracking, :tracking_description

        has_many :instruments
        has_many :indicators
      end
    end
  end
end
