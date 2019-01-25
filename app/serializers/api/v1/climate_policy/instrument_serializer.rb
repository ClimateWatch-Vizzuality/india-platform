module Api
  module V1
    module ClimatePolicy
      class InstrumentSerializer < ActiveModel::Serializer
        attribute :name, key: :title
        attributes :description, :policy_scheme, :scheme,
                   :policy_status, :key_milestones, :implementation_entities,
                   :broader_context, :source, :updated_at

        def source
          object.sources.first&.link
        end
      end
    end
  end
end
