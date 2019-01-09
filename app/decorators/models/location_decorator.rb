Location.class_eval do
  # _validators.delete(:location_type)

  # _validate_callbacks.each do |callback|
  #   if callback.raw_filter.respond_to? :attributes
  #     callback.raw_filter.attributes.delete :location_type
  #   end
  # end

  # validates :location_type, presence: true, inclusion: {
  #   in: %w(COUNTRY STATE TERRITORY)
  # }
end
