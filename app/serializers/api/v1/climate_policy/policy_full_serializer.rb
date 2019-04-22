module Api
  module V1
    module ClimatePolicy
      class PolicyFullSerializer < ActiveModel::Serializer
        attributes :code, :policy_type, :sector, :description, :title,
                   :authority, :tracking, :tracking_description,
                   :status, :progress, :key_policy, :sources

        has_many :instruments, serializer: Api::V1::ClimatePolicy::InstrumentSerializer
        has_many :indicators, serializer: Api::V1::ClimatePolicy::IndicatorSerializer do
          object.indicators.order("CASE category
                                      WHEN 'Activity' THEN 0
                                      WHEN 'Activity Indicator' THEN 1
                                      WHEN 'Intermediate Effect' THEN 2
                                      WHEN 'Effect' THEN 3
                                      WHEN 'Finance' THEN 4
                                      WHEN 'Other' THEN 5
                                      ELSE 6
                                    END ASC")
        end
        has_many :milestones, serializer: Api::V1::ClimatePolicy::MilestoneSerializer do
          object.milestones.order("to_date(date, 'YYYY') DESC")
        end

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
