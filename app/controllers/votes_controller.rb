class VotesController < ApplicationController
  before_filter :require_json_login

  def create
    @vote = current_user.votes.build(params[:vote])
    if @vote.save
      render json: @vote
    else
      p @vote.errors.full_messages
      render json: {}, status: 422
    end

  end

  def update
    @vote = current_user.votes.find(id)
    if @vote
      if @vote.update_attributes(params[:vote])
      render json: @vote
      else
      render json: {}, status: 422
      end
    else
      render json: {}, status: 403
    end
  end

  def destroy
    @vote = current_user.votes.find(params[:id])
    if @vote
      @vote.destroy
      render json: {message: "Vote destroyed!"}
    else
      render json: {}, status: 422
    end
  end
end
