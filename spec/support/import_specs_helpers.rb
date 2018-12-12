module ImportSpecsHelpers
  def remove_headers(file_content, *headers)
    new_csv = CSV.parse(file_content, headers: true)
    headers.each { |header| new_csv.delete(header.to_s) }
    new_csv.to_csv
  end

  def stub_with_files(files)
    Aws.config[:s3] = {
      stub_responses: {
        get_object: lambda do |context|
          {body: files[context.params[:key]]}
        end
      }
    }
  end
end
