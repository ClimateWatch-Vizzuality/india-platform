ActiveAdmin.register_page 'Text Management' do
  content title: 'Text management' do
    para 'This page consists of website texts that could be changed dynamically for all supported languages.'

    para 'Page names are capitalized to easily find out which texts belong to the page.'

    table_for TextEntry.find_by(params), class: 'table index_table' do
      column :identifier
      column 'English text', :en_value
      column 'Actions' do |translation|
        link_to 'Edit', admin_text_management_edit_path(key: translation.key)
      end
    end
  end

  sidebar :filter, only: :index, partial: 'filter'

  page_action :edit, method: :get do
    entry = TextEntry.all.find { |te| te.key.to_s == params[:key].to_s }

    return redirect_to admin_text_management_path unless entry.present?

    render 'edit', locals: {entry: entry}, layout: 'active_admin'
  end

  page_action :update, method: :post do
    if TextEntry.new(entry_params).save
      flash[:notice] = 'Text entry saved!'
      redirect_to admin_text_management_path
    else
      render 'edit'
    end
  end

  controller do
    def entry_params
      params.require(:entry).permit(:key, :en_value)
    end
  end
end
