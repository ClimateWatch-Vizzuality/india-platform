module Api
  module V1
    module ClimatePolicy
      class PolicyFullSerializer < ActiveModel::Serializer
        attributes :code, :policy_type, :sector, :description, :title,
                   :authority, :tracking, :tracking_description,
                   :status, :progress, :key_policy, :sources

        has_many :instruments, serializer: Api::V1::ClimatePolicy::InstrumentSerializer
        has_many :indicators, serializer: Api::V1::ClimatePolicy::IndicatorSerializer
        has_many :milestones, serializer: Api::V1::ClimatePolicy::MilestoneSerializer

        def sources
          ActiveModelSerializers::SerializableResource.new(
            ::ClimatePolicy::Source.all,
            each_serializer: Api::V1::ClimatePolicy::SourceSerializer
          ).as_json
        end
      end
    end
  end
end
