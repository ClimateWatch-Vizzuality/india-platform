module Api
  module V1
    module ClimatePolicy
      class PolicySerializer < ActiveModel::Serializer
        attributes :code, :policy_type, :sector, :description, :title,
                   :authority, :tracking, :tracking_description
      end
    end
  end
end
