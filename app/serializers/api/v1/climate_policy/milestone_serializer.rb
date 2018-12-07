module Api
  module V1
    module ClimatePolicy
      class MilestoneSerializer < ActiveModel::Serializer
        attributes :name, :responsible_authority, :date, :data_source_link, :status
      end
    end
  end
end
