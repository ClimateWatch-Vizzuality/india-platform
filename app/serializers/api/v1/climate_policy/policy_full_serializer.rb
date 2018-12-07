module Api
  module V1
    module ClimatePolicy
      class PolicyFullSerializer < ActiveModel::Serializer
        attributes :code, :policy_type, :sector, :description, :title,
                   :authority, :tracking, :tracking_description

        has_many :instruments, serializer: Api::V1::ClimatePolicy::InstrumentSerializer
        has_many :indicators, serializer: Api::V1::ClimatePolicy::IndicatorSerializer
        has_many :milestones, serializer: Api::V1::ClimatePolicy::MilestoneSerializer
      end
    end
  end
end
