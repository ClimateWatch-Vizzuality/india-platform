module Api
  module V1
    module ClimatePolicy
      class MilestoneSerializer < ActiveModel::Serializer
        attributes :name, :responsible_authority, :date, :source_id, :data_source_link, :status

        def data_source_link
          object.source&.link
        end
      end
    end
  end
end
