module Api
  module V1
    class DataSourceSerializer < ActiveModel::Serializer
      attributes :short_title, :title, :source_organization,
                 :learn_more_link, :citation, :notes
    end
  end
end
