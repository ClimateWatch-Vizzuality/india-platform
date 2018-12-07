module Api
  module V1
    module ClimatePolicy
      class InstrumentSerializer < ActiveModel::Serializer
        attributes :code, :name, :description, :policy_scheme, :scheme,
                   :policy_status, :key_milestones, :implementation_entities,
                   :broader_context, :source
      end
    end
  end
end
