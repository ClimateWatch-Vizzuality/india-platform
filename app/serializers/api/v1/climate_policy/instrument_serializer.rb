module Api
  module V1
    module ClimatePolicy
      class InstrumentSerializer < ActiveModel::Serializer
        attribute :name, key: :title
        attributes :code, :description, :policy_scheme, :scheme,
                   :policy_status, :key_milestones, :implementation_entities,
                   :broader_context, :source
      end
    end
  end
end
